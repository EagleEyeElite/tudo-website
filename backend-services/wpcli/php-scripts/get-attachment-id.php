<?php
// get-attachment-id.php

// Assuming the filename is passed as the first argument.
$filename = $args[0];

// Access the WordPress database via $wpdb.
global $wpdb;

// Attempt to retrieve the attachment ID based on the filename.
// Note: Adjust the query if your attachments are not stored directly in the wp_posts table.
$attachment_id = $wpdb->get_var($wpdb->prepare(
    "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_value LIKE %s LIMIT 1",
    '%' . $wpdb->esc_like($filename) . '%'
));

// Check if an attachment ID was found.
if ($attachment_id) {
    echo $attachment_id;
} else {
    echo "No attachment found for {$filename}\n";
    exit(1); // Exit with an error status if no attachment is found.
}
