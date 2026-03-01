/// Returns true if the string contains only alphanumeric characters and underscores.
pub fn is_valid_username(username: &str) -> bool {
    !username.is_empty()
        && username
            .chars()
            .all(|c| c.is_ascii_alphanumeric() || c == '_')
}

/// Returns true if the URI is non-empty and starts with a supported scheme.
/// Pass an empty string for optional URI fields when no URI is set.
pub fn is_valid_uri(uri: &str) -> bool {
    !uri.is_empty()
        && (uri.starts_with("https://")
            || uri.starts_with("http://")
            || uri.starts_with("ipfs://")
            || uri.starts_with("ar://"))
}
