SELECT * FROM inventory
JOIN
classification
ON
inventory.classification_id=classification.classification_id
WHERE classification_name='Sport';