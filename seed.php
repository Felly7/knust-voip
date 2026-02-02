<?php
// Read the JS file
$jsContent = file_get_contents('directory_data.js');

// Strip out the variable declaration to get raw JSON
$jsContent = preg_replace('/^const directoryData = /', '', $jsContent);
$jsContent = preg_replace('/;$/', '', trim($jsContent));

// Decode to verify validity
$data = json_decode($jsContent, true);

if ($data) {
    // Add Resources manually to merge them into one DB
    $resources = [
        [
            "title" => "Main VoIP Directory",
            "description" => "Access the complete directory of VoIP contacts.",
            "url" => "https://voip.knust.edu.gh/",
            "type" => "link",
            "category" => "Directory"
        ],
        [
            "title" => "Report VoIP issues",
            "description" => "Submit a ticket for technical problems.",
            "url" => "https://helpdesk.knust.edu.gh/open.php",
            "type" => "link",
            "category" => "Support"
        ],
        [
            "title" => "View VoIP Manual",
            "description" => "Guides and manuals for VoIP usage.",
            "url" => "https://docs.google.com/document/d/1QhZ7lKkm1h_joyMGE0UdZVVJJmmS0o4dIygiyRCnIYg/edit?usp=sharing",
            "type" => "resource",
            "category" => "Training"
        ]
        // Add others as needed... kept short for brevity in seed
    ];

    // Merge: Store properly structure
    // We will separate them in the DB object
    $db = [
        "directory" => $data,
        "resources" => $resources
    ];

    file_put_contents('database.json', json_encode($db, JSON_PRETTY_PRINT));
    echo "Database seeded successfully with " . count($data) . " directory items.";
} else {
    echo "Failed to parse directory_data.js";
}
?>