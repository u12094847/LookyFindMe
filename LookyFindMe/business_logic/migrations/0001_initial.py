# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Friend',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('Friend', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Person',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('Username', models.CharField(max_length=30)),
                ('Password', models.CharField(max_length=30)),
                ('Name', models.CharField(max_length=30)),
                ('Surname', models.CharField(max_length=30)),
                ('FriendCount', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='friend',
            name='userID',
            field=models.ForeignKey(to='business_logic.Person'),
            preserve_default=True,
        ),
    ]
