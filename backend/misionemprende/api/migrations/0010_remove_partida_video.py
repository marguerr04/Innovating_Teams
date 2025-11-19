from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_copy_partida_video_data'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='partida',
            name='video',
        ),
    ]
