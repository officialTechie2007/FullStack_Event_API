from fastapi import FastAPI
app = FastAPI()

def func1():
    return "Hello"

def func2():
    return "World"

@app.get("/IEE")
def home():
    return {"message": "WELCOME TO FIRST API"}

@app.get("/message")
def message():
    return {"message": "NANTI"}


@app.get("/combine")
def combine():
    a = func1()
    b = func2()
    return {
        "first": a,
        "second": b
    }