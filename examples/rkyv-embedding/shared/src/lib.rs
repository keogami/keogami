use rkyv::{Archive, Serialize};

// This cannot be const/static because include_bytes! only accepts a string literal
#[macro_export]
macro_rules! ARCHIVE_NAME {
    () => {
        // arbitrary name
        "archived_bytes.rkyv"
    };

    ($env_name:literal) => {
        concat!(env!($env_name), "/", ARCHIVE_NAME!())
    };
}

#[derive(Archive, Serialize, Debug)]
#[rkyv(derive(Debug))]
pub struct EmbeddedData {
    pub simple_string: String,
    pub simple_number: u32,
}

impl Default for EmbeddedData {
    fn default() -> Self {
        Self {
            simple_string: "Our embedded string".into(),
            simple_number: 0xEFBEADDE,
        }
    }
}
