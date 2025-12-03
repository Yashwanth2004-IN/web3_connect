window.ethers = (() => {
    const provider = window.ethereum ? new Proxy({}, {
        get: (_, method) => (...params) =>
            window.ethereum.request({ method, params })
    }) : null;

    return {
        providers: {
            Web3Provider: class {
                constructor() {
                    this.provider = window.ethereum;
                }
                async send(method, params) {
                    return await window.ethereum.request({ method, params });
                }
                getSigner() {
                    return {
                        getAddress: async () =>
                            (await window.ethereum.request({ method: "eth_requestAccounts" }))[0],
                    };
                }
                async getBalance(address) {
                    return await window.ethereum.request({
                        method: "eth_getBalance",
                        params: [address, "latest"]
                    });
                }
            }
        },
        utils: {
            formatEther: (wei) => (parseInt(wei, 16) / 1e18).toString()
        },
        Contract: class {
            constructor() { }
        }
    };
})();
