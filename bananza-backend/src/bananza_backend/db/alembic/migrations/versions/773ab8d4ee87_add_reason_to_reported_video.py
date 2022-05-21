"""Add reason to reported video

Revision ID: 773ab8d4ee87
Revises: bb6304951fcb
Create Date: 2022-05-21 16:19:37.250148

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '773ab8d4ee87'
down_revision = 'bb6304951fcb'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('reportedVideos', schema=None) as batch_op:
        batch_op.add_column(sa.Column('reason', sa.String(), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('reportedVideos', schema=None) as batch_op:
        batch_op.drop_column('reason')

    # ### end Alembic commands ###
