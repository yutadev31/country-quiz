{ pkgs, ... }:
pkgs.mkShell {
  packages = with pkgs; [
    nixd
    nixfmt
    typos-lsp
    pyright
    black
    typescript-language-server
    tailwindcss-language-server
    vscode-langservers-extracted

    nodejs
    bun
    (python313.withPackages (
      ps: with ps; [
        pandas
      ]
    ))
  ];
}
