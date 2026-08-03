from datetime import UTC, datetime


def utc_now() -> datetime:
    """Naive UTC datetime, deliberately without tzinfo.

    MySQL has no equivalent of Postgres's timestamptz — DATETIME columns
    store no timezone at all. The whole app standardizes on "naive, but
    always UTC" so that a value read back from the database is directly
    comparable to a freshly computed one, instead of raising
    can't-compare-aware-and-naive errors.
    """
    return datetime.now(UTC).replace(tzinfo=None)
