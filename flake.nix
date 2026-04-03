{
  description = "Tauri + Android dev shell (pure Nix, no rustup)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    rust-overlay.url = "github:oxalica/rust-overlay";
  };

  outputs = { self, nixpkgs, rust-overlay }:
    let
      system = "x86_64-linux";

      pkgs = import nixpkgs {
        inherit system;
        overlays = [ rust-overlay.overlays.default ];
      };

      rust = pkgs.rust-bin.stable.latest.default.override {
        extensions = [ "rust-src" ];
        targets = [
          "aarch64-linux-android"
          "armv7-linux-androideabi"
          "i686-linux-android"
          "x86_64-linux-android"
        ];
      };

    in {
      devShells.${system}.default = pkgs.mkShell {
        nativeBuildInputs = with pkgs; [
          python313
          python313Packages.pandas
          pkg-config
          wrapGAppsHook4
          jdk17_headless
        ];

        buildInputs = with pkgs; [
          rust
          librsvg
          webkitgtk_4_1
        ];

        LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
          pkgs.stdenv.cc.cc.lib
        ];

        shellHook = ''
          export XDG_DATA_DIRS="$GSETTINGS_SCHEMAS_PATH"

          export ANDROID_HOME=$HOME/Android/Sdk
          export ANDROID_SDK_ROOT=$HOME/Android/Sdk
          export NDK_HOME=$ANDROID_HOME/ndk/29.0.13846066

          unset RUSTUP_HOME
          unset CARGO_HOME

          rustc --version
        '';
      };
    };
}
