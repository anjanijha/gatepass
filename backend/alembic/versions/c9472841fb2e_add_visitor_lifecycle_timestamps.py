"""add visitor lifecycle timestamps

Revision ID: c9472841fb2e
Revises: 27e9a5e15156
Create Date: 2026-09-14 03:29:21.796392

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "c9472841fb2e"
down_revision: Union[str, Sequence[str], None] = "27e9a5e15156"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.add_column(
        "visitor_requests",
        sa.Column(
            "approved_at",
            sa.DateTime(),
            nullable=True,
        ),
    )

    op.add_column(
        "visitor_requests",
        sa.Column(
            "checked_in_at",
            sa.DateTime(),
            nullable=True,
        ),
    )

    op.add_column(
        "visitor_requests",
        sa.Column(
            "checked_out_at",
            sa.DateTime(),
            nullable=True,
        ),
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column(
        "visitor_requests",
        "checked_out_at",
    )

    op.drop_column(
        "visitor_requests",
        "checked_in_at",
    )

    op.drop_column(
        "visitor_requests",
        "approved_at",
    )