"""Add partida FK to Video (nullable) to support one-to-many relation.
"""
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0007_alter_partida_video"),
    ]

    operations = [
        migrations.AddField(
            model_name="video",
            name="partida",
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='videos', to='api.partida'),
        ),
    ]
