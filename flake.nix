{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    rust-overlay.url = "github:oxalica/rust-overlay";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      rust-overlay,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [ rust-overlay.overlays.default ];
          config = {
            allowUnfree = true;
            android_sdk.accept_license = true;
          };
        };

        rust = pkgs.rust-bin.stable.latest.default.override {
          extensions = [
            "rust-src"
            "rust-analyzer"
          ];

          targets = [
            "aarch64-linux-android"
            "armv7-linux-androideabi"
            "i686-linux-android"
            "x86_64-linux-android"
          ];
        };

        androidComposition = pkgs.androidenv.composeAndroidPackages {
          platformVersions = [
            "35"
            "36"
          ];
          buildToolsVersions = [
            "35.0.0"
            "36.0.0"
          ];

          includeNDK = true;
          includeSystemImages = false;
        };

        androidSdk = androidComposition.androidsdk;
      in
      {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            bun
            rust
            androidSdk
            gradle
            python313
            python313Packages.pandas

            pkg-config
            openssl
          ];

          ANDROID_HOME = "${androidSdk}/libexec/android-sdk";
          ANDROID_SDK_ROOT = "${androidSdk}/libexec/android-sdk";
          JAVA_HOME = "${pkgs.jdk17.home}";

          shellHook = ''
            export NDK_HOME="$ANDROID_HOME/ndk/$(ls -1 "$ANDROID_HOME/ndk" | head -n1)"
            export ANDROID_NDK_HOME="$NDK_HOME"

            export PATH="$ANDROID_HOME/platform-tools:$PATH"

            echo "Android SDK: $ANDROID_HOME"
            echo "Android NDK: $NDK_HOME"
            echo "Java: $JAVA_HOME"
          '';
        };
      }
    );
}
