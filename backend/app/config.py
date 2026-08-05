from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy.engine import URL


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    environment: str = "development"

    database_url: str = "mysql+pymysql://mohlakoana:mohlakoana@localhost:3306/mohlakoana"
    test_database_url: str = "mysql+pymysql://mohlakoana:mohlakoana@localhost:3306/mohlakoana_test"

    # Optional discrete fields. When DB_PASSWORD is set, database_url is built
    # from these via SQLAlchemy's URL.create instead of being parsed from a
    # raw string, so passwords with special characters (@, #, etc.) never
    # need manual percent-encoding in the .env file.
    db_user: str = ""
    db_password: str = ""
    db_host: str = "localhost"
    db_port: int = 3306
    db_name: str = ""

    @model_validator(mode="after")
    def _build_database_url_from_parts(self) -> "Settings":
        if self.db_password:
            self.database_url = URL.create(
                "mysql+pymysql",
                username=self.db_user,
                password=self.db_password,
                host=self.db_host,
                port=self.db_port,
                database=self.db_name,
            ).render_as_string(hide_password=False)
        return self

    staff_jwt_secret: str = "change-me-staff-secret"
    client_jwt_secret: str = "change-me-client-secret"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    bfp_base_url: str = ""
    bfp_service_account_email: str = ""
    bfp_service_account_password: str = ""


settings = Settings()
