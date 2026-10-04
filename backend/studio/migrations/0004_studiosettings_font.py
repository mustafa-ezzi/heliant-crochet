from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("studio", "0003_studiosettings"),
    ]

    operations = [
        migrations.AddField(
            model_name="studiosettings",
            name="font",
            field=models.CharField(default="studio", max_length=32),
        ),
    ]
