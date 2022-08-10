#![no_std]
#![no_main]

use casper_contract::{
    contract_api::{account, runtime},
    unwrap_or_revert::UnwrapOrRevert,
};
use casper_types::account::{AccountHash, Weight};

const ARG_WEIGHT: &str = "weight";

const ARG_ACCOUNT: &str = "account";

#[no_mangle]
pub extern "C" fn call() {
    let account: AccountHash = runtime::get_named_arg(ARG_ACCOUNT);
    let mod_weight: u8 = runtime::get_named_arg(ARG_WEIGHT);

    let weight2 = Weight::new(mod_weight);
    account::update_associated_key(account, weight2).unwrap_or_revert();
}
