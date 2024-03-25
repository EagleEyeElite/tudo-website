<?php
// Set the WordPress user's avatar.
// Usage: wp eval-file set-avatar.php <user_id> <attachment_id>

$user_id = $args[0];
$attachment_id = $args[1];

// Attempt to retrieve URLs for all available sizes of the attachment.
$attachment_urls = [];
$sizes = ['thumbnail', 'medium', 'large', 'full'];
foreach ($sizes as $size) {
    $url = wp_get_attachment_image_url($attachment_id, $size);
    if ($url) {
        $attachment_urls[$size] = $url;
    }
}

if (empty($attachment_urls)) {
    echo "Error: No URLs found for attachment with ID $attachment_id.\n";
    exit(1);
}

// Prepare the avatar data array.
$avatar_data = [];
foreach ($attachment_urls as $size => $url) {
    $avatar_data[$size] = $url;
}

// Assuming the 'simple_local_avatar' expects an array of URLs keyed by size.
update_user_meta($user_id, 'simple_local_avatar', $avatar_data);

echo "Avatar updated for user ID $user_id.\n";
