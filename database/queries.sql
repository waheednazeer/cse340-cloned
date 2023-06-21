SELECT inv_make, inv_model, classification_name FROM inventory
JOIN
classification
ON
inventory.classification_id=classification.classification_id
WHERE classification_name='Sport';