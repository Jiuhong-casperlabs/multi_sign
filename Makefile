prepare:
	rustup target add wasm32-unknown-unknown

build-contract:
	cargo build --release -p add-associated-key --target wasm32-unknown-unknown
	cargo build --release -p update-associated-key --target wasm32-unknown-unknown
	cargo build --release -p authorized-keys --target wasm32-unknown-unknown
	wasm-strip target/wasm32-unknown-unknown/release/add_associated_key.wasm 2>/dev/null | true
	wasm-strip target/wasm32-unknown-unknown/release/update_associated_key.wasm 2>/dev/null | true
	wasm-strip target/wasm32-unknown-unknown/release/authorized_keys.wasm 2>/dev/null | true

clippy:
	cargo clippy --all-targets --all -- -D warnings -A renamed_and_removed_lints

check-lint: clippy
	cargo fmt --all -- --check

lint: clippy
	cargo fmt --all
	
clean:
	cargo clean
	rm -rf target
	rm Cargo.lock