use std::{env, fs, path::Path};

use anyhow::Context;
use rkyv::{rancor, to_bytes};
use types::{ARCHIVE_NAME, EmbeddedData};

fn main() -> anyhow::Result<()> {
    let data_to_embed = EmbeddedData::default();
    let archived_bytes =
        to_bytes::<rancor::Error>(&data_to_embed).context("Couldn't serialize data")?;

    let out_path = env::var("OUT_DIR").context("Couldn't find out directory for the build")?;

    // The name is arbitrary
    let out_path = Path::new(&out_path).join(ARCHIVE_NAME!());

    fs::write(out_path, &archived_bytes).context("Couldn't write the archived bytes")?;

    Ok(())
}
