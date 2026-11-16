# python3 tracker/add_row.py <scene> <series> <caption> <notes> <duration_s>   (appends a row dated today, UK time)
import csv, sys, datetime
scene, series, caption, notes, dur = sys.argv[1:6]
cols = next(csv.reader(open("tracker/posts.csv")))
row = dict.fromkeys(cols, "")
row.update(date=datetime.datetime.utcnow().strftime("%Y-%m-%d"), scene=scene, series=series, caption=caption, notes=notes, duration_s=dur)
csv.writer(open("tracker/posts.csv", "a", newline="")).writerow([row[c] for c in cols])
