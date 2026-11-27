-- SQLite: first observed timestamp per stage; require ordered progression.
WITH first_events AS (
 SELECT user, MIN(channel) AS channel,
 MIN(CASE WHEN stage='visit' THEN hour END) AS visit,
 MIN(CASE WHEN stage='signup' THEN hour END) AS signup,
 MIN(CASE WHEN stage='documents' THEN hour END) AS documents,
 MIN(CASE WHEN stage='review' THEN hour END) AS review,
 MIN(CASE WHEN stage='approved' THEN hour END) AS approved
 FROM events GROUP BY user
), flags AS (
 SELECT *, visit IS NOT NULL AS v,
 visit IS NOT NULL AND signup>=visit AS s,
 visit IS NOT NULL AND signup>=visit AND documents>=signup AS d,
 visit IS NOT NULL AND signup>=visit AND documents>=signup AND review>=documents AS r,
 visit IS NOT NULL AND signup>=visit AND documents>=signup AND review>=documents AND approved>=review AS a
 FROM first_events
), summary AS (
 SELECT channel, SUM(v) AS visit, COALESCE(SUM(s),0) AS signup, COALESCE(SUM(d),0) AS documents,
 COALESCE(SUM(r),0) AS review, COALESCE(SUM(a),0) AS approved,
 AVG(CASE WHEN a THEN approved-review END) AS mean_review_hours
 FROM flags GROUP BY channel
 UNION ALL
 SELECT 'All', SUM(v),COALESCE(SUM(s),0),COALESCE(SUM(d),0),COALESCE(SUM(r),0),COALESCE(SUM(a),0),AVG(CASE WHEN a THEN approved-review END) FROM flags
)
SELECT * FROM summary ORDER BY channel;
