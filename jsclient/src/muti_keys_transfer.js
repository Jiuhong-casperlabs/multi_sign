/**
 * @fileOverview CSPR JS SDK demo: Native transfers.
 */

import _ from "lodash";
import { CasperClient, DeployUtil, CLURef, CLPublicKey } from "casper-js-sdk";
import * as constants from "../constants";
import * as utils from "../utils";

// Amount with which to fund each account.
const AMOUNT_TO_TRANSFER = 2500000000;

const main = async () => {
  //Step1: set casper node client
  const client = new CasperClient(constants.DEPLOY_NODE_ADDRESS);

  // === target key pair ===
  const target = utils.getKeyPairOfContract(constants.PATH_TO_TRAGET_KEYS);

  // === signingKeys ===
  const signingKeys = [
    utils.getKeyPairOfContract(constants.PATH_TO_SIGN_KEY1),
    utils.getKeyPairOfContract(constants.PATH_TO_SIGN_KEY2),
  ];

  // === master public key ====
  const pk1String =
    "01922a5b41fef37207fb239d4863809f9e409b067efe2ead6cc26f0e1faa823ad0";

  const masterPublickey = CLPublicKey.fromHex(pk1String);

  // === master purse ===
  const masterPurse =
    "uref-78618f20cdf2d3335839db86e9f6642da8511be2c1b7b48baff36910c810b126-007";

  //step 3.1 set deploy
  let deploy = DeployUtil.makeDeploy(
    new DeployUtil.DeployParams(
      masterPublickey,
      "casper-net-1",
      constants.DEPLOY_GAS_PAYMENT,
      constants.DEPLOY_TTL_MS
    ),
    DeployUtil.ExecutableDeployItem.newTransfer(
      AMOUNT_TO_TRANSFER,
      target.publicKey,
      CLURef.fromFormattedStr(masterPurse),
      _.random()
    ),
    DeployUtil.standardPayment(constants.DEPLOY_GAS_PAYMENT_FOR_NATIVE_TRANSFER)
  );

  //step 3.2 Sign Deploy
  for (let key of signingKeys) {
    console.log(`Signed by: ${key.publicKey.toAccountHashStr()}`);
    deploy = client.signDeploy(deploy, key);
  }

  //ste 3.4 Dispatch deploy to node
  let deployHash = await client.putDeploy(deploy);

  console.log(`deploy hash = ${deployHash}`);
};

main();
