/**
 * @fileOverview CSPR JS SDK demo: ERC20 - install contract.
 */

import {
  CasperClient,
  CLValueBuilder,
  DeployUtil,
  RuntimeArgs,
  CLPublicKey,
} from "casper-js-sdk";
import * as constants from "../constants";
import * as utils from "../utils";

// Path to contract to be installed.
const PATH_TO_CONTRACT = constants.PATH_TO_CONTRACT_ERC_20;

// Token parameters.
const TOKEN_NAME = "Acme Token";
const TOKEN_SYMBOL = "ACME";
const TOKEN_DECIMALS = 11;
const TOKEN_SUPPLY = 1e15;

/**
 * Demonstration entry point.
 */
const main = async () => {
  // Step 1: Set casper node client.
  const client = new CasperClient("http://localhost:11101/rpc");

  // === master public key ====
  const pk1String =
    "01922a5b41fef37207fb239d4863809f9e409b067efe2ead6cc26f0e1faa823ad0";

  const masterPublickey = CLPublicKey.fromHex(pk1String);

  // set signing keys
  const signingKeys = [
    utils.getKeyPairOfContract(constants.PATH_TO_SIGN_KEY1),
    utils.getKeyPairOfContract(constants.PATH_TO_SIGN_KEY2),
  ];

  // Step 3: Set contract installation deploy (unsigned).
  let deploy = DeployUtil.makeDeploy(
    new DeployUtil.DeployParams(
      masterPublickey,
      "casper-net-1",
      constants.DEPLOY_GAS_PRICE,
      constants.DEPLOY_TTL_MS
    ),
    DeployUtil.ExecutableDeployItem.newModuleBytes(
      utils.getBinary(PATH_TO_CONTRACT),
      RuntimeArgs.fromMap({
        decimals: CLValueBuilder.u8(TOKEN_DECIMALS),
        name: CLValueBuilder.string(TOKEN_NAME),
        symbol: CLValueBuilder.string(TOKEN_SYMBOL),
        total_supply: CLValueBuilder.u256(TOKEN_SUPPLY),
      })
    ),
    DeployUtil.standardPayment(200000000000)
  );

  // Step 4: Sign deploy.

  for (let key of signingKeys) {
    console.log(`Signed by: ${key.publicKey.toAccountHashStr()}`);
    deploy = client.signDeploy(deploy, key);
  }

  // Step 5: Dispatch deploy to node.
  const deployHash = await client.putDeploy(deploy);

  // Step 6: Render deploy details.
  logDetails(deployHash);
};

/**
 * Emits to stdout deploy details.
 * @param {String} deployHash - Identifer of dispatched deploy.
 */
const logDetails = (deployHash) => {
  console.log(`deploy hash = ${deployHash}`);
};

main();
