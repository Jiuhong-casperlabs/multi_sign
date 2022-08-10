#![no_std]
#![no_main]

use casper_contract::{
    contract_api::{account, runtime},
    unwrap_or_revert::UnwrapOrRevert,
};
use casper_types::{
    account::{AccountHash, ActionType, AddKeyFailure, Weight},
    ApiError,
};

const ARG_KEY_MANAGEMENT_THRESHOLD: &str = "key_management_threshold";
const ARG_DEPLOY_THRESHOLD: &str = "deploy_threshold";

#[no_mangle]
pub extern "C" fn call() {
    let key_management_threshold: u8 = runtime::get_named_arg(ARG_KEY_MANAGEMENT_THRESHOLD);
    let deploy_threshold: u8 = runtime::get_named_arg(ARG_DEPLOY_THRESHOLD);

    if key_management_threshold != 0 {
        account::set_action_threshold(
            ActionType::KeyManagement,
            Weight::new(key_management_threshold),
        )
        .unwrap_or_revert()
    }

    if deploy_threshold != 0 {
        account::set_action_threshold(ActionType::Deployment, Weight::new(deploy_threshold))
            .unwrap_or_revert()
    }
}
