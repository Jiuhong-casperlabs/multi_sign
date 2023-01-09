import argparse

import pycspr
from pycspr import NodeClient
from pycspr import NodeConnection
from pycspr.crypto import KeyAlgorithm
from pycspr.types import CL_ByteArray
from pycspr.types import Deploy
from pycspr.types import DeployParameters
from pycspr.types import ModuleBytes
from pycspr.types import PrivateKey


# Path to testnet assets.
_PATH_TO_KEY = "/home/jh/keys/test1/secret_key.pem"
_PATH_TO_WASM = "/home/jh/mywork/multi-sign/target/wasm32-unknown-unknown/release/remove_associated_key.wasm"
_PATH_TO_ASSOCIATED_KEY = "/home/jh/keys/test98/public_key_hex"
_TESTNET_NODE = '94.130.10.55'
# CLI argument parser.
_ARGS = argparse.ArgumentParser(
    "Demo illustrating how to add associated key.")

# CLI argument: path to contract operator secret key - defaults to test98.
_ARGS.add_argument(
    "--operator-secret-key-path",
    default=_PATH_TO_KEY,
    dest="path_to_operator_secret_key",
    help="Path to operator's secret_key.pem file.",
    type=str,
)

# CLI argument: type of contract operator secret key - defaults to ED25519.
_ARGS.add_argument(
    "--operator-secret-key-type",
    default=KeyAlgorithm.ED25519.name,
    dest="type_of_operator_secret_key",
    help="Type of operator's secret key.",
    type=str,
)

# CLI argument: path to smart contract wasm binary - defaults to remove_associated_key.wasm.
_ARGS.add_argument(
    "--path-to-wasm",
    default=_PATH_TO_WASM,
    dest="path_to_wasm",
    help="Path to .wasm file.",
    type=str,
)

# CLI argument: name of target chain - defaults to casper-test chain.
_ARGS.add_argument(
    "--chain",
    default="casper-test",
    dest="chain_name",
    help="Name of target chain.",
    type=str,
)

# CLI argument: amount in motes to be offered as payment.
_ARGS.add_argument(
    "--payment",
    default=int(5e9),
    dest="deploy_payment",
    help="Amount in motes to be offered as payment.",
    type=int,
)

# CLI argument: host address of target node - defaults to 94.130.10.55.
_ARGS.add_argument(
    "--node-host",
    default=_TESTNET_NODE,
    dest="node_host",
    help="Host address of target node.",
    type=str,
)

# CLI argument: Node API JSON-RPC port - defaults to 7777.
_ARGS.add_argument(
    "--node-port-rpc",
    default=7777,
    dest="node_port_rpc",
    help="Node API JSON-RPC port.  Typically 7777 on most nodes.",
    type=int,
)

# CLI argument: account pk path to be removed.
_ARGS.add_argument(
    "--path_to_account_key",
    default=_PATH_TO_ASSOCIATED_KEY,
    dest="path_to_account_key",
    help="path to associated key.",
    type=str,
)


def _main(args: argparse.Namespace):
    """Main entry point.

    :param args: Parsed command line arguments.

    """
    # Set node client.
    client = _get_client(args)

    # Set contract operator.
    operator = _get_operator_key(args)

    # Set deploy.
    deploy: Deploy = _get_deploy(args, operator)

    # Approve deploy.
    deploy.approve(operator)

    # Dispatch deploy to a node.
    client.send_deploy(deploy)

    print("-" * 72)
    print(f"Deploy dispatched to node [{args.node_host}]: {deploy.hash.hex()}")
    print("-" * 72)


def _get_client(args: argparse.Namespace) -> NodeClient:
    """Returns a pycspr client instance.

    """
    return NodeClient(NodeConnection(
        host=args.node_host,
        port_rpc=args.node_port_rpc,
    ))


def _get_operator_key(args: argparse.Namespace) -> PrivateKey:
    """Returns the smart contract operator's private key.

    """
    return pycspr.parse_private_key(
        args.path_to_operator_secret_key,
        args.type_of_operator_secret_key,
    )


def _get_deploy(args: argparse.Namespace, operator: PrivateKey) -> Deploy:
    """Returns delegation deploy to be dispatched to a node.

    """
    # Set standard deploy parameters.
    params: DeployParameters = \
        pycspr.create_deploy_parameters(
            account=operator,
            chain_name=args.chain_name
        )

    # Set payment logic.
    payment: ModuleBytes = \
        pycspr.create_standard_payment(args.deploy_payment)

    cp2 = pycspr.parse_public_key(
        args.path_to_account_key
    )

    # Set session logic.
    session: ModuleBytes = ModuleBytes(
        module_bytes=pycspr.read_wasm(args.path_to_wasm),
        args={
            "account": CL_ByteArray(cp2.account_hash)
        }
    )

    return pycspr.create_deploy(params, payment, session)


# Entry point.
if __name__ == "__main__":
    _main(_ARGS.parse_args())
