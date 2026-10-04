import logging
import os
import uuid

import boto3
from botocore.config import Config

log = logging.getLogger(__name__)

ALLOWED = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
}
MAX_BYTES = 8 * 1024 * 1024


class ShelfError(Exception):
    def __init__(self, message, status=400):
        super().__init__(message)
        self.message = message
        self.status = status


def shelf():
    account = os.environ.get("R2_ACCOUNT_ID", "")
    access_key = os.environ.get("R2_ACCESS_KEY_ID", "")
    secret = os.environ.get("R2_SECRET_ACCESS_KEY", "")
    public = os.environ.get("R2_PUBLIC_URL", "").rstrip("/")
    bucket = os.environ.get("R2_BUCKET", "heliant-media")
    if not account or not access_key or not secret or not public:
        return None
    client = boto3.client(
        "s3",
        endpoint_url=f"https://{account}.r2.cloudflarestorage.com",
        aws_access_key_id=access_key,
        aws_secret_access_key=secret,
        region_name="auto",
        config=Config(
            signature_version="s3v4",
            s3={"addressing_style": "path"},
            request_checksum_calculation="when_required",
            response_checksum_validation="when_required",
        ),
    )
    return client, bucket, public


def store_photo(uploaded):
    content_type = (getattr(uploaded, "content_type", "") or "").split(";")[0].strip().lower()
    extension = ALLOWED.get(content_type)
    if extension is None:
        raise ShelfError("Use a JPG, PNG, WEBP, or GIF photo.")
    if uploaded.size > MAX_BYTES:
        raise ShelfError("That photo is larger than 8 MB.")

    connected = shelf()
    if connected is None:
        raise ShelfError("The photo shelf is not connected yet.", 503)
    client, bucket, public = connected

    key = f"products/{uuid.uuid4().hex}{extension}"
    try:
        client.upload_fileobj(
            uploaded.file,
            bucket,
            key,
            ExtraArgs={"ContentType": content_type},
        )
    except Exception:
        log.exception("R2 upload failed")
        raise ShelfError("The photo did not reach the shelf. Please try again.", 502) from None
    return f"{public}/{key}"


def remove_photos(urls):
    connected = shelf()
    if connected is None:
        log.warning("R2 is not connected, so product photos were left on the shelf")
        return
    client, bucket, public = connected
    prefix = f"{public}/"
    for url in urls:
        src = str(url or "").split("?")[0]
        if not src.startswith(prefix):
            continue
        key = src[len(prefix) :].lstrip("/")
        if not key.startswith("products/") or ".." in key:
            continue
        try:
            client.delete_object(Bucket=bucket, Key=key)
        except Exception:
            log.exception("R2 delete failed")
