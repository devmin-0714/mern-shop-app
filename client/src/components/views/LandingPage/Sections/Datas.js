const continents = [
    {
        "_id": 1,
        "name": "Africa"
    },
    {
        "_id": 2,
        "name": "Europe"
    },
    {
        "_id": 3,
        "name": "Asia"
    },
    {
        "_id": 4,
        "name": "North America"
    },
    {
        "_id": 5,
        "name": "South America"
    },
    {
        "_id": 6,
        "name": "Australia"
    },
    {
        "_id": 7,
        "name": "Antarctica"
    }

]

const price = [
    {
        "_id": 0,
        "name": "Any",
        "array": []
    },
    {
        "_id": 1,
        "name": "$0 to $249",
        "array": [0, 249]
    },
    {
        "_id": 2,
        "name": "$250 to $499",
        "array": [250, 499]
    },
    {
        "_id": 3,
        "name": "$500 to $749",
        "array": [500, 749]
    },
    {
        "_id": 4,
        "name": "$750 to $999",
        "array": [750, 999]
    },
    {
        "_id": 5,
        "name": "More than $1000",
        "array": [1000, 1500000]
    }
]

export {
    continents,
    price
}