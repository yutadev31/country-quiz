{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            nodejs
            bun
            python313
            python313Packages.pandas

            nixd
            nixfmt
            typos-lsp
            pyright
            black
            typescript-language-server
            tailwindcss-language-server
            vscode-langservers-extracted
          ];
        };
      }
    );
}
