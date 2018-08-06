/**
 * Created by Konstantin Nedovizin on 30.07.2018.
 */


const Client        = require('bitcoin-core');
const md5           = require('md5'); // package.json << "md5": "^2.2.1"
const salt          = 'DerGfhjkm8F';
const request       = require('request-promise');

let client;

const OuterMethods  = [
    'getNewAddress',
    'listTransactions',
    'sendMany',
    'convertToBtc',
    'getTicker'
];

class BtcReqDev {
    constructor( method, params = [] ) {

        console.log('BtcReqDev constructor', arguments);

        /* if(OuterMethods.indexOf(method) < 0) {
            throw new Error(`Unknown method ${method}`)
        } */

        if( !Array.isArray(params)) {
            console.log('params', params);
            throw new Error(`Params must be an array`)
        }

        this.opts = {
            method: 'POST',
            url: 'http://atlantwork.com/btcapi/rawCall',
            headers: {
                'atl-dt'        : null,
                'atl-tkn'       : null,
                'Content-Type'  : 'application/json' },
            body: { method, params },
            json: true
        }

    }

    do() {
        const timestamp = Date.now();
        const hash      = md5(timestamp + salt);

        this.opts.headers["atl-dt"]  = timestamp;
        this.opts.headers["atl-tkn"] = hash;

        console.log('BTC dev req', this.opts);

        return request(this.opts)

    }
}

class BTC {

    constructor(opts = {}) {

        const envs = ['dev'];

        if(opts.env && envs.indexOf(opts.env) < 0 ) {
            throw new Error(`Wrong environment type '${opts.env}'`);
        }

        if(opts.env === 'dev') {

            this.dev = true;

        } else {

            this.client = new Client({
                host: '172.17.0.2',
                username: 'atlant',
                password: 'gHd-nJl7P7H13q3E1CugscNFXOGd55DdTfbTUa0qBvI=',
                network: 'mainnet'
            });

            client = this.client;
        }
    }

    static checkToken(timestamp, token) {
        return token === md5(timestamp + salt);
    }


    /**
     * Получение нового адреса для заданного аккаунта кошелька. Возвращает новый уникальный адрес.
     *
     * @param {String} [account = ""] - аккаунт для которого нужен адрес
     *
     * @return {String} - Новый BTC address
     */
    async getNewAddress( account = '' ) {

        try {

            if(typeof account !== 'string') {
                throw new Error('getNewAddress account param must be a string');
            }

            if(this.dev) {
                const devReq = new BtcReqDev('getNewAddress', [account]);
                return devReq.do();
            }

            const address = await client.getNewAddress( account );

            return address;
        } catch (e) {
            console.error(`getNewAddress ${JSON.stringify(arguments)}`, e);
            throw e
        }
    }

    /**
     * Возвращает список транзакций для аккаунта, есть возможность пагинации
     *
     * @param {Text} [account=""] - аккаунт, по умолчанию это корневой, дефолтный аккаунт без имени
     * @param {int} [fromTx = 0] - Смещение от самой поздней транзакции
     * @param {int} [countTx = 10] - Количетво возвращаемых транзакций
     *
     * @return {Array} - Возвращает массив объектов транзакций
     */
    async listTransactions(account = '', fromTx = 0, countTx = 10) {
        try {

            if(typeof account !== 'string') {
                throw new Error('listTransactions account param must be a string');
            }

            if(this.dev) {
                const devReq = new BtcReqDev('listTransactions', [account, fromTx, countTx]);
                return devReq.do();
            }

            const transactions = await client.listTransactions(account, countTx, fromTx);

            return transactions;
        } catch (e) {
            console.error(`listTransactions ${JSON.stringify(arguments)}`, e);
            throw e
        }
    }

    /**
     * Создает транзакцию с многими приемниками BTC в одной операции
     *
     * @param {text} [account = ""] - Аккауни для создания транзакции, по умолчанию дефолтный
     * @param {Object} addresses - Объект с адресами приёмниками
     * @property {String} addresses.address - адрес BTC
     * @property {float} addresses.value - сумма в BTC
     * @param {int} confirmations - количество подтверждений для валидации транзакции и изменения баланса аккаунта
     * @param {string} comment - Коментарий к транзакции (виден только владельцу кошелька)
     *
     * @return {string} - Возвращает ID транзакции с блокчейне
     */
    async sendMany(account = '', addresses = {}, confirmations = 6, comment = '') {
        try {

            if(typeof account !== 'string') {
                throw new Error('sandMany account param must be a string');
            }

            if(typeof addresses !== 'object') {
                throw new Error('sandMany addresses param must be an object');
            }

            if( Object.keys(addresses).length < 1) {
                throw new Error('sandMany addresses param must have at least one address')
            }

            if(this.dev) {
                const devReq = new BtcReqDev('sendMany', [account, addresses, confirmations, comment]);
                return devReq.do();
            }

            const txId = await client.sendMany(account, addresses, confirmations, comment);

            return txId;
        } catch (e) {
            console.error(`sendMany ${JSON.stringify(arguments)}`, e);
            throw e
        }
    }

    /**
     * Конвертирует переданную сумму в указанной валюте в BTC по текщему курсу
     *
     * @param {float} [value = 75] - Сумма для конвертации
     * @param {string} [currency = 'USD'] - Изначальная валюта, по умолчанию доллары США
     * @return {{value: float, currency: string, btc: float, rate: object}} - Возвращает объект с заданными условиями и суммой в BTC, а также объект с информацие о текущем курсе
     */
    async convertToBtc(value = 75, currency = 'USD') {

        const options = { method: 'GET',
            url: 'https://blockchain.info/tobtc',
            qs: {
                currency,
                value
            }
        }
        const btcCount = await request(options);
        const ticker = await this.getTicker();

        return { value, currency, btc: parseFloat(btcCount), rate: ticker[currency]};

    }

    /**
     * Возвращает текущий курс BTC
     *
     * @return {object} - возвращает объект с текущим курсом BTC для разных валют
     */
    async getTicker() {

        const options = { method: 'GET',
            url: 'https://blockchain.info/ticker',
            json: true
        }
        const ticker = await request(options);

        return ticker;

    }

    adHoc(method, params) {
        if(this.dev) {
            const devReq = new BtcReqDev(method, params);
            return devReq.do();
        }
    }

}

module.exports = BTC;


