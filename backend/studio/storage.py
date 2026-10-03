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


def store_photo(uploaded):
    content_type = (getattr(uploaded, "content_type", "") or "").split(";")[0].strip().lower()
    extension = ALLOWED.get(content_type)
    if extension is None:
        raise ShelfError("Use a JPG, PNG, WEBP, or GIF photo.")
    if uploaded.size > MAX_BYTES:
        raise ShelfError("That photo is larger than 8 MB.")

    account = os.environ.get("R2_ACCOUNT_ID", "")
    access_key = os.environ.get("R2_ACCESS_KEY_ID", "")
    secret = os.environ.get("R2_SECRET_ACCESS_KEY", "")
    public = os.environ.get("R2_PUBLIC_URL", "").rstrip("/")
    bucket = os.environ.get("R2_BUCKET", "heliant-media")
    if not account or not access_key or not secret or not public:
        raise ShelfError("The photo shelf is not connected yet.", 503)

    key = f"products/{uuid.uuid4().hex}{extension}"
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
