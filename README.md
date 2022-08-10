## Keys prepare
```
master_key : 
/home/jh/casper-node/utils/nctl/assets/net-1/users/user-1/secret_key.pem
01922a5b41fef37207fb239d4863809f9e409b067efe2ead6cc26f0e1faa823ad0
account-hash-b91270185138a9b4afc8c2d0675240a0334e620d88bf69ee63a77c1bda487168

sign_key_1:
/home/jh/keys/test1/secret_key.pem
account-hash-9a770006ffda6f5b40f9f2752e8e82ee4c7f0dc11d1e83ecda5b1d25598195a9

sign_key_2:
/home/jh/keys/test2/secret_key.pem
account-hash-ab32c6ed39f43ff55febd0e3e8baa31c84929c1bf50a2b48186d6f286e531145
```

## contract prepare
```
make build-contract
```

## update the master key weight to 3
```
casper-client put-deploy --chain-name casper-net-1 \
-n http://localhost:11101/rpc \
--session-path target/wasm32-unknown-unknown/release/update_associated_key.wasm \
--payment-amount 100000000000 \
--secret-key /home/jh/casper-node/utils/nctl/assets/net-1/users/user-1/secret_key.pem \
--session-arg "account:account_hash='account-hash-b91270185138a9b4afc8c2d0675240a0334e620d88bf69ee63a77c1bda487168'" \
--session-arg "weight:u8='3'"
```

## add associated_keys(execut it twice to add sign_key1 and sign_key2)
```
casper-client put-deploy --chain-name casper-net-1 \
-n http://localhost:11101/rpc \
--session-path target/wasm32-unknown-unknown/release/add_associated_key.wasm \
--payment-amount 100000000000 \
--secret-key /home/jh/casper-node/utils/nctl/assets/net-1/users/user-1/secret_key.pem \
--session-arg "account:account_hash='account-hash-ab32c6ed39f43ff55febd0e3e8baa31c84929c1bf50a2b48186d6f286e531145'" \
--session-arg "weight:u8='2'"
```

## set master key's deploy threshold to 3(key_manegement_threshold to 3 as well) 
```
casper-client put-deploy --chain-name casper-net-1 \
-n http://localhost:11101/rpc \
--session-path target/wasm32-unknown-unknown/release/authorized_keys.wasm \
--payment-amount 100000000000 \
--secret-key /home/jh/casper-node/utils/nctl/assets/net-1/users/user-1/secret_key.pem \
--session-arg "key_management_threshold:u8='3'" \
--session-arg "deploy_threshold:u8='3'"
```


[js client](jsclient/README.md)


The master key should be like this:
```
   # "result": {
    #     "api_version": "1.0.0",
    #     "stored_value": {
    #         "Account": {
    #             "account_hash": "account-hash-b91270185138a9b4afc8c2d0675240a0334e620d88bf69ee63a77c1bda487168",
    #             "named_keys": [],
    #             "main_purse": "uref-78618f20cdf2d3335839db86e9f6642da8511be2c1b7b48baff36910c810b126-007",
    #             "associated_keys": [
    #                 {
    #                     "account_hash": "account-hash-9a770006ffda6f5b40f9f2752e8e82ee4c7f0dc11d1e83ecda5b1d25598195a9",
    #                     "weight": 2
    #                 },
    #                 {
    #                     "account_hash": "account-hash-ab32c6ed39f43ff55febd0e3e8baa31c84929c1bf50a2b48186d6f286e531145",
    #                     "weight": 2
    #                 },
    #                 {
    #                     "account_hash": "account-hash-b91270185138a9b4afc8c2d0675240a0334e620d88bf69ee63a77c1bda487168",
    #                     "weight": 3
    #                 }
    #             ],
    #             "action_thresholds": {
    #                 "deployment": 3,
    #                 "key_management": 3
    #             }
    #         }
    #     },
```