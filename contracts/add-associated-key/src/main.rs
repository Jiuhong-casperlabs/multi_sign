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
    let weight: u8 = runtime::get_named_arg(ARG_WEIGHT);

    let weight = Weight::new(weight);
    account::add_associated_key(account, weight).unwrap_or_revert();
}
