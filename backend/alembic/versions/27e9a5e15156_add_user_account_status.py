"""add user account status

Revision ID: 27e9a5e15156
Revises: 
Create Date: 2026-09-12 21:43:25.730913

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '27e9a5e15156'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:

    # ---------------------------------------
    # 1. Add columns as nullable temporarily
    # ---------------------------------------

    op.add_column(
        "users",
        sa.Column(
            "is_active",
            sa.Boolean(),
            nullable=True
        )
    )

    op.add_column(
        "users",
        sa.Column(
            "created_at",
            sa.DateTime(),
            nullable=True
        )
    )

    op.add_column(
        "users",
        sa.Column(
            "updated_at",
            sa.DateTime(),
            nullable=True
        )
    )

    # ---------------------------------------
    # 2. Backfill existing users
    # ---------------------------------------

    op.execute(
        """
        UPDATE users
        SET is_active = TRUE
        WHERE is_active IS NULL
        """
    )

    op.execute(
        """
        UPDATE users
        SET created_at = CURRENT_TIMESTAMP
        WHERE created_at IS NULL
        """
    )

    op.execute(
        """
        UPDATE users
        SET updated_at = CURRENT_TIMESTAMP
        WHERE updated_at IS NULL
        """
    )

    # ---------------------------------------
    # 3. Make columns NOT NULL
    # ---------------------------------------

    op.alter_column(
        "users",
        "is_active",
        existing_type=sa.Boolean(),
        nullable=False
    )

    op.alter_column(
        "users",
        "created_at",
        existing_type=sa.DateTime(),
        nullable=False
    )

    op.alter_column(
        "users",
        "updated_at",
        existing_type=sa.DateTime(),
        nullable=False
    )

    # ---------------------------------------
    # IMPORTANT
    # ---------------------------------------
    # Do NOT drop users_mobile_key.
    # Do NOT create another mobile index here.
    #
    # The mobile column must remain UNIQUE.


def downgrade() -> None:

    op.drop_column(
        "users",
        "updated_at"
    )

    op.drop_column(
        "users",
        "created_at"
    )

    op.drop_column(
        "users",
        "is_active"
    )