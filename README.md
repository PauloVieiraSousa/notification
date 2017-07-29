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
                    maxPrice: 100.2,
                    minPrice: 10.1,
                    limitDate: new Date(2019, 8, 1)
                },
                insertedAt: new Date(),
                items: [
                    {
                        pass: {
                            url: 'https://www.decolar.com/passagens-aereas/sao/ssa/passagens-aereas-para-salvador-saindo-de-sao+paulo?p=M1:1',
                            price: 89.1
                        }
                    }
                ]
}

```
