## Run

    - Para rodar o projeto, você deve copiar o arquivo .env do google drive e adicionar ao projeto
    - Rotina para disparo de notificações do RexScanner
## Disparo da rotina
dados: 
``` 
{
        user: {
            name: 'Erick Wendel',
            fbUser: 'erickwendel',
            email: 'rexflightscanner@gmail.com',
            phone: '5511969803385'

        },
        notification: {
            sms: true,
            email: true,
            messengerBot: false
        },
        processed: false,
        configuration: {
            maxPrice: 10002,
            minPrice: 101,
            limitDate: new Date(2019, 8, 1)
        },
        insertedAt: new Date(),
        items: [{
            "itineraries": [{
                "outbound": {
                    "flights": [{
                        "departs_at": "2017-11-01T22:25",
                        "arrives_at": "2017-11-02T00:45",
                        "origin": {
                            "airport": "GRU",
                            "terminal": "2"
                        },
                        "destination": {
                            "airport": "SLZ"
                        },
                        "marketing_airline": "G3",
                        "operating_airline": "G3",
                        "flight_number": "1596",
                        "aircraft": "738",
                        "booking_info": {
                            "travel_class": "ECONOMY",
                            "booking_code": "P",
                            "seats_remaining": 9
                        }
                    }]
                },
                "inbound": {
                    "flights": [{
                        "departs_at": "2017-11-17T02:25",
                        "arrives_at": "2017-11-17T06:50",
                        "origin": {
                            "airport": "SLZ"
                        },
                        "destination": {
                            "airport": "GRU",
                            "terminal": "2"
                        },
                        "marketing_airline": "G3",
                        "operating_airline": "G3",
                        "flight_number": "1597",
                        "aircraft": "738",
                        "booking_info": {
                            "travel_class": "ECONOMY",
                            "booking_code": "A",
                            "seats_remaining": 9
                        }
                    }]
                }
            }],
            "fare": { 
                "total_price": "880.46",
                "price_per_adult": {
                    "total_fare": "880.46",
                    "tax": "59.43"
                },
                "restrictions": {
                    "refundable": false,
                    "change_penalties": true
                }
            }
        }]

    }

```
