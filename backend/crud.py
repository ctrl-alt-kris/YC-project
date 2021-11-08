from fastapi import HTTPException, status

def add(schema, model, db):
    return model.create(db, **schema.dict())


def get(id, model, db):
    data = db.query(model).filter(model.id == id).first()
    if not data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{id} not found.")
    return data


def edit(id, request, model, db):
    data = db.query(model).filter(model.id == id).first()
    if not data:
        raise HTTPException(status_code=status.HTTP_424_FAILED_DEPENDENCY, detail=f'{id} not found.')
    new_data = request.dict(exclude_unset=True)
    for key, value in new_data.items():
        setattr(data, key, value)
    db.commit()
    db.refresh(data)
    return data.__dict__ # FIX THIS LATER! 


def delete(id, model, db):
    data = db.query(model).filter(model.id == id).first()
    if not data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{id} not found.")
    db.delete(data)
    db.commit()
    return 'Deleted.'