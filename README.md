# Catppuccin Icons for Orca

![Catppuccin file icons](assets/cover.webp)

Soothing pastel file and folder icons for [Orca](https://github.com/stablyai/orca), in Catppuccin
Latte (light) and Mocha (dark).

This is an unofficial port, not maintained by the Catppuccin team. The icons come from
[catppuccin/vscode-icons](https://github.com/catppuccin/vscode-icons), and the approach follows
[catppuccin/zed-icons](https://github.com/catppuccin/zed-icons): a script turns upstream's icon
mappings into Orca's format.

## Install

Find it in Orca's plugin directory, or from a terminal:

```sh
orca plugin install vincentferniot/catppuccin-orca-icons
```

Then pick a flavor in Orca's settings, under the file icon theme.

## Limits

Orca allows at most 512 mappings per icon theme (the three default icons, plus every file name,
extension and folder name; a folder costs two, collapsed and expanded). Upstream has about 2,600,
so `scripts/selection.ts` keeps the ~500 most common. Anything else falls back to the default file
or folder icon. To add one, drop another entry there and rebuild; the build fails if you go over
the limit or name something upstream does not have.

Only Latte and Mocha ship, like Orca's own Catppuccin theme. Each flavor needs its own copy of
every SVG, since only the colors change: with all four flavors (1,340 files) Orca's plugin
directory held the plugin for a size review. Frappé, Macchiato and the monochrome variants from
zed-icons could ship as separate plugins.

## How Orca picks an icon

- A file: its exact name (`package.json`), then its extensions from the longest to the shortest
  (`foo.test.ts` tries `test.ts`, then `ts`), then the default file icon. A dotfile like `.env`
  matches the extension `env`.
- A folder: its exact name, then the default folder icon. Open folders use the expanded map.
- All matching ignores case.

## Develop

Requires Node 22.18 or newer (it runs the TypeScript build script directly) and the Orca CLI.

```sh
npm run build      # writes themes/*.json and icons/<flavor>/*.svg
npm run validate   # checks the plugin the way Orca loads it
orca plugin dev load .
```

The build downloads catppuccin/vscode-icons at the commit pinned in `scripts/build.ts`
(`UPSTREAM_COMMIT`) into `~/.cache/catppuccin-orca-icons/`, outside the repository: Orca counts
every file in the plugin folder, up to 2,000, and upstream alone has over 3,000. To update the
icons, bump that commit and rebuild.

## Publish

1. Bump `version` in `orca-plugin.json`, rebuild, validate, commit and push.
2. Tag that commit and push the tag: `git tag -a v0.2.0 -m v0.2.0 && git push origin v0.2.0`.

Orca's directory picks up the newest `vX.Y.Z` tag within about an hour (the repository carries the
`orca-plugin` topic). Status: `https://orca.dev/plugins/vincentferniot/catppuccin-orca-icons`.

## License

MIT, see [LICENSE](LICENSE). Icons and cover image by [Catppuccin](https://github.com/catppuccin)
(from catppuccin/vscode-icons).
