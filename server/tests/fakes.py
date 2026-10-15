"""Stand-ins for Neon Auth and the file bucket, so tests never call the real services."""
import json
import secrets
import uuid
from urllib.parse import parse_qs

import httpx

from backend.neon_auth import COOKIE

AUTH_URL = "https://auth.test/neondb/auth"


class FakeNeonAuth:
    """The parts of Neon Auth (Better Auth) Study AI uses, with the same replies and error codes."""

    def __init__(self):
        self.users: dict[str, dict] = {}     # id -> {id, email, name, emailVerified, password}
        self.sessions: dict[str, str] = {}   # cookie value -> user id
        self.reset_links: list[dict] = []    # {"email", "token", "redirectTo"}
        self.codes: dict[str, str] = {}      # email -> emailed code
        self.requests: list[httpx.Request] = []
        self.require_confirmed_email = False  # Neon's "require email verification" setting

    # ---------- helpers for tests ----------
    def user_by_email(self, email: str) -> dict | None:
        return next((u for u in self.users.values() if u["email"] == email.lower()), None)

    def delete_user(self, user_id: str) -> None:
        self.users.pop(user_id, None)
        self.sessions = {s: u for s, u in self.sessions.items() if u != user_id}

    # ---------- the fake service ----------
    def _public(self, user: dict) -> dict:
        return {k: user[k] for k in ("id", "email", "name", "emailVerified")}

    def _new_session(self, user: dict, status: int = 200, extra: dict | None = None) -> httpx.Response:
        token = secrets.token_urlsafe(16)
        cookie = f"{token}.{secrets.token_urlsafe(8)}%3D"
        self.sessions[cookie] = user["id"]
        body = {"token": token, "user": self._public(user), **(extra or {})}
        return httpx.Response(status, json=body, headers={
            "set-cookie": f"{COOKIE}={cookie}; Max-Age=604800; Path=/; HttpOnly; Secure; SameSite=None; Partitioned"
        })

    def _session_user(self, request: httpx.Request) -> dict | None:
        cookies = dict(
            part.strip().split("=", 1) for part in (request.headers.get("cookie") or "").split(";") if "=" in part
        )
        user_id = self.sessions.get(cookies.get(COOKIE, ""))
        return self.users.get(user_id) if user_id else None

    @staticmethod
    def _error(status: int, code: str, message: str = "") -> httpx.Response:
        return httpx.Response(status, json={"code": code, "message": message or code})

    def handle(self, request: httpx.Request) -> httpx.Response:
        self.requests.append(request)
        path = request.url.path.removeprefix("/neondb/auth")
        if request.method == "POST" and not request.headers.get("origin"):
            return self._error(403, "MISSING_OR_NULL_ORIGIN")
        body = json.loads(request.content or b"{}") if request.method == "POST" else {}
        me = self._session_user(request)

        if path == "/sign-up/email":
            if self.user_by_email(body["email"]):
                return self._error(422, "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL")
            if len(body["password"]) < 8:
                return self._error(400, "PASSWORD_TOO_SHORT")
            user = {"id": str(uuid.uuid4()), "email": body["email"].lower(), "name": body.get("name") or "",
                    "emailVerified": False, "password": body["password"]}
            self.users[user["id"]] = user
            if self.require_confirmed_email:  # no sign-in yet; the code is emailed
                self.codes[user["email"]] = f"{secrets.randbelow(10**6):06d}"
                return httpx.Response(200, json={"token": None, "user": self._public(user)})
            return self._new_session(user)
        if path == "/sign-in/email":
            user = self.user_by_email(body["email"])
            if not user or user["password"] != body["password"]:
                return self._error(401, "INVALID_EMAIL_OR_PASSWORD")
            if self.require_confirmed_email and not user["emailVerified"]:
                return self._error(403, "EMAIL_NOT_VERIFIED", "Email not verified")
            return self._new_session(user, extra={"redirect": False})
        if path == "/get-session":
            if not me:
                return httpx.Response(200, content=b"null", headers={"content-type": "application/json"})
            return httpx.Response(200, json={"session": {"userId": me["id"]}, "user": self._public(me)})
        if path == "/sign-out":
            self.sessions = {s: u for s, u in self.sessions.items() if s not in (request.headers.get("cookie") or "")}
            return httpx.Response(200, json={"success": True})
        if path == "/change-password":
            if not me:
                return self._error(401, "UNAUTHORIZED")
            if me["password"] != body["currentPassword"]:
                return self._error(400, "INVALID_PASSWORD")
            me["password"] = body["newPassword"]
            if body.get("revokeOtherSessions"):
                self.sessions = {s: u for s, u in self.sessions.items() if u != me["id"]}
            return self._new_session(me)
        if path == "/request-password-reset":
            if self.user_by_email(body["email"]):
                self.reset_links.append({"email": body["email"], "token": secrets.token_urlsafe(12),
                                         "redirectTo": body["redirectTo"]})
            return httpx.Response(200, json={"status": True})
        if path == "/reset-password":
            link = next((x for x in self.reset_links if x["token"] == body["token"]), None)
            if not link:
                return self._error(400, "INVALID_TOKEN")
            self.reset_links.remove(link)
            user = self.user_by_email(link["email"])
            user["password"] = body["newPassword"]
            self.sessions = {s: u for s, u in self.sessions.items() if u != user["id"]}
            return httpx.Response(200, json={"status": True})
        if path == "/email-otp/send-verification-otp":
            self.codes[body["email"]] = f"{secrets.randbelow(10**6):06d}"
            return httpx.Response(200, json={"success": True})
        if path == "/email-otp/verify-email":
            if self.codes.get(body["email"]) != body["otp"]:
                return self._error(400, "INVALID_OTP")
            del self.codes[body["email"]]
            user = self.user_by_email(body["email"])
            user["emailVerified"] = True
            return self._new_session(user, extra={"status": True})  # Neon signs in after confirming
        if path == "/revoke-sessions":
            if not me:
                return self._error(401, "UNAUTHORIZED")
            self.sessions = {s: u for s, u in self.sessions.items() if u != me["id"]}
            return httpx.Response(200, json={"status": True})
        return httpx.Response(404)


class FakeBucket:
    """An S3 bucket in memory, with the boto3 calls originals.py makes."""

    def __init__(self):
        self.objects: dict[str, dict] = {}

    def put_object(self, Bucket, Key, Body, ContentType):
        self.objects[Key] = {"body": bytes(Body), "type": ContentType}

    def delete_objects(self, Bucket, Delete):
        for item in Delete["Objects"]:
            self.objects.pop(item["Key"], None)

    def list_objects_v2(self, Bucket, Prefix, ContinuationToken=None):
        keys = sorted(k for k in self.objects if k.startswith(Prefix))
        start = int(ContinuationToken or 0)
        page = keys[start : start + 2]  # small pages, so paging is tested
        more = start + 2 < len(keys)
        return {"Contents": [{"Key": k} for k in page], "IsTruncated": more,
                **({"NextContinuationToken": str(start + 2)} if more else {})}

    def generate_presigned_url(self, op, Params, ExpiresIn):
        return f"https://files.test/{Params['Bucket']}/{Params['Key']}?expires={ExpiresIn}&" + "&".join(
            f"{k}={v}" for k, v in Params.items() if k.startswith("Response")
        )

    def get(self, url: str) -> dict:
        """The object a link from generate_presigned_url points at, and the link's details."""
        path, _, query = url.removeprefix("https://files.test/").partition("?")
        key = path.split("/", 1)[1]
        return {"key": key, **self.objects[key], "params": {k: v[0] for k, v in parse_qs(query).items()}}
