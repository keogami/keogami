use rkyv::util::Align;
use shared::{ARCHIVE_NAME, ArchivedEmbeddedData};

static ARCHIVED_DATA: Align<[u8; include_bytes!(ARCHIVE_NAME!("OUT_DIR")).len()]> =
    Align(*include_bytes!(ARCHIVE_NAME!("OUT_DIR")));

fn main() -> anyhow::Result<()> {
    let archived_data: &'static ArchivedEmbeddedData =
        unsafe { rkyv::access_unchecked(ARCHIVED_DATA.as_ref()) };

    println!("{archived_data:#?}");

    Ok(())
}
