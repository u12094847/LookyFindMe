# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('business_logic', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Request',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('Friend', models.IntegerField()),
                ('userID', models.ForeignKey(to='business_logic.Person')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='friend',
            name='status',
            field=models.IntegerField(null=True),
            preserve_default=True,
        ),
    ]
