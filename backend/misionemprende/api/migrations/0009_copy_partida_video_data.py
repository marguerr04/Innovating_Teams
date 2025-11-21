from django.db import migrations


def copy_partida_to_video(apps, schema_editor):
    Partida = apps.get_model('api', 'Partida')
    Video = apps.get_model('api', 'Video')
    # Para cada partida que tenga el campo video (antigua relación), asignar la partida al video referenciado
    for partida in Partida.objects.exclude(video_id__isnull=True):
        video_id = partida.video_id
        try:
            v = Video.objects.get(pk=video_id)
            v.partida_id = partida.id
            v.save(update_fields=['partida_id'])
        except Video.DoesNotExist:
            continue


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_add_partida_to_video'),
    ]

    operations = [
        migrations.RunPython(copy_partida_to_video, reverse_code=migrations.RunPython.noop),
    ]
