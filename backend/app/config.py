from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    environment: str = "development"

    database_url: str = "mysql+pymysql://mohlakoana:mohlakoana@localhost:3306/mohlakoana"
    test_database_url: str = "mysql+pymysql://mohlakoana:mohlakoana@localhost:3306/mohlakoana_test"

    staff_jwt_secret: str = "change-me-staff-secret"
    client_jwt_secret: str = "change-me-client-secret"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    bfp_base_url: str = ""
    bfp_service_account_email: str = ""
    bfp_service_account_password: str = ""


settings = Settings()
