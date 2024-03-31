<?php

/**
 * Update the ACF 'background' field for a specific attachment.
 *
 * @param int|string $attachment_id The ID of the attachment.
 * @param bool $value The value to set (true for background, false for no background).
 * @return void
 */
function update_acf_use_for_landing_page_hero_banner_for_attachment($attachment_id, $value) {
    // Check if ACF function exists
    if (!function_exists('update_field')) {
        echo "ACF is not installed or activated.\n";
        return;
    }

    // ACF field key for the 'background' field
    $field_key = 'field_65fcc7f2596ee';

    // Attempt to update the field
    $success = update_field($field_key, $value, $attachment_id);

    if ($success) {
        echo "Successfully updated 'use-for-landing-page-hero-banner' field for attachment ID {$attachment_id}.\n";
    } else {
        echo "Failed to update 'use-for-landing-page-hero-banner' field for attachment ID {$attachment_id}.\n";
    }
}

// Get the attachment ID and value from the command line arguments
$attachment_id = $args[0];
$value = $args[1];


// Call the function with the provided arguments
update_acf_use_for_landing_page_hero_banner_for_attachment($attachment_id, $value);
