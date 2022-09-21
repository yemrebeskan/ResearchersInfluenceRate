# README.md

# Researchers Influence Rates Graph

This project was done to see who influences researchers and who is influenced. In this way, people who look at an article on a subject can see who the researcher is influenced by, and can also look at other researchers and gain information on this subject. Also, researchers know from whom they are influenced, but they do not know who influenced them. This project will be a resource for them as well.

![WhatsApp_Image_2022-09-15_at_12.19.07.jpeg](README%20md%20230659b7f3e04bca9f31fd30e7c3ff93/WhatsApp_Image_2022-09-15_at_12.19.07.jpeg)

![WhatsApp_Image_2022-09-15_at_12.19.20.jpeg](README%20md%20230659b7f3e04bca9f31fd30e7c3ff93/WhatsApp_Image_2022-09-15_at_12.19.20.jpeg)

![WhatsApp_Image_2022-09-15_at_12.19.36.jpeg](README%20md%20230659b7f3e04bca9f31fd30e7c3ff93/WhatsApp_Image_2022-09-15_at_12.19.36.jpeg)

![WhatsApp_Image_2022-09-15_at_12.17.40.jpeg](README%20md%20230659b7f3e04bca9f31fd30e7c3ff93/WhatsApp_Image_2022-09-15_at_12.17.40.jpeg)

![WhatsApp_Image_2022-09-15_at_12.18.46.jpeg](README%20md%20230659b7f3e04bca9f31fd30e7c3ff93/WhatsApp_Image_2022-09-15_at_12.18.46.jpeg)

## Used Technologies:

1- Python : os, psycopg2, pandas, json, nltk, textblob, sklearn, numpy, matplotlib, csv, schedule, datetime

2- Anaconda environment

3- Javascript

4- React: d3

5- Node.js

6- MySQL, PostgreSQL, SQL

7- NLP, Statisctics

Steps Of Project:

1- Files with all the articles were downloaded from aws with aws code.

```python
import os
cmd = "aws s3 cp --no-sign-request --recursive s3://ai2-s2-research-public/open-corpus/2022-04-05/ /home/recos/corpus/"
os.system(cmd)
```

2- Articles of researchers registered in the school's database were extracted from the data of approximately 500 GB. From this data, the articles of the researchers who incited and outcited the researchers in the our database were taken and articles were put two seperate files. Then these files were merged and all articles were made unique.

3- All researchers who incited and outcited in sample set’s researchers and all co-published authors were taken.

4- All articles that were incited and outcited were compared with the articles that did by natural language processing, and the similarity rate with the formula was statistically extracted.

5- In each dictionary, the name of the author was added to the list in the form of the authors who outcited and incited him/her, and their influenced rate, co-publishing and number. Then each dictionary has been added to database index by index. Then necessary things were added for the code to run automatically.

Database code:

```python
sql = 'DROP TABLE md'
curr.execute(sql)
sql = 'CREATE TABLE md(id serial, j JSONB, PRIMARY KEY (id))'
curr.execute(sql)
sql = 'ALTER TABLE md SET UNLOGGED'
curr.execute(sql)
sql = "copy md (j) from 'outputs/ResOutputs' csv quote e'\x01' delimiter e'\x02'"
curr.execute(sql)
sql = 'ALTER TABLE md SET LOGGED'
curr.execute(sql)
sql = 'create index d on md using gin(j)'
curr.execute(sql)
curr.close()
conn.close()
```

I developed this project in consultation with my mentor, Researchers Ecosystem cofounder, Tolga Ayav.

Note: Data Manipulation part should be private so it has not been published.
