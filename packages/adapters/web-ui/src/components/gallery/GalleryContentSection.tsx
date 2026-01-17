import React from 'react';
import {
    MarkdownEditor,
    RegexTester,
    ConflictResolver,
    DiffStatSummary,
    CodeDiffViewer,
    JsonDiff,
    HexInspector,
    ImageCompare,
    PdfPreview,
    FileMetadataCard,
    CsvViewer,
    FileAssetPicker,
    ImageDiff,
    AccordionList,
    RichMarkdownRenderer
} from '../index';

export const GalleryContentSection = () => {
    return (
        <div className="app-grid">

            {/* -- Row 1: Editors & Markdown -- */}
            <div className="app-card col-span-2">
                <div className="app-card-header">
                    <h3>MarkdownEditor</h3>
                    <p>Live preview writing</p>
                </div>
                <div className="app-card-body">
                    <MarkdownEditor
                        initialValue="# Hello World\n\nThis is a **live** editor.\n\n- Feature 1\n- Feature 2"
                    />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>RegexTester</h3>
                    <p>Pattern matching</p>
                </div>
                <div className="app-card-body">
                    <RegexTester
                        initialPattern="([A-Z])\w+"
                        initialText="Hello World, this is a Test String for Regex."
                    />
                </div>
            </div>


            {/* -- Row 2: Diffs & Comparisons -- */}
            <div className="app-card col-span-2">
                <div className="app-card-header">
                    <h3>ConflictResolver</h3>
                    <p>3-way merge tool</p>
                </div>
                <div className="app-card-body">
                    <ConflictResolver
                        filename="app/utils.ts"
                        base="function add(a, b) { return a + b; }"
                        current="function add(a, b) { \n  // Local change\n  return a + b; \n}"
                        incoming="function add(a, b) { \n  // Remote change\n  console.log('add');\n  return a + b; \n}"
                    />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>DiffStatSummary</h3>
                    <p>Change metrics</p>
                </div>
                <div className="app-card-body">
                    <DiffStatSummary added={124} modified={45} removed={12} files={8} />
                    <div style={{ height: 16 }} />
                    <CodeDiffViewer
                        oldCode="const x = 1;"
                        newCode="const x = 2;\nconst y = 3;"
                        filePath="src/constants.ts"
                        mode="unified"
                    />
                </div>
            </div>


            {/* -- Row 3: Visual Inspectors -- */}
            <div className="app-card">
                <div className="app-card-header">
                    <h3>JsonDiff</h3>
                    <p>Structure comparison</p>
                </div>
                <div className="app-card-body">
                    <JsonDiff
                        oldJson={{ name: "App", version: "1.0", debug: true }}
                        newJson={{ name: "App", version: "2.0", features: ["new"] }}
                    />
                </div>
            </div>

            <div className="app-card col-span-2">
                <div className="app-card-header">
                    <h3>HexInspector</h3>
                    <p>Binary analysis</p>
                </div>
                <div className="app-card-body">
                    <HexInspector data={new Uint8Array([
                        0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0x57, 0x6f, 0x72, 0x6c, 0x64, 0x21, 0x00, 0x00, 0x00, 0x00,
                        0xDe, 0xad, 0xbe, 0xef, 0xca, 0xfe, 0xba, 0xbe, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08
                    ])} />
                </div>
            </div>


            {/* -- Row 4: File Previews -- */}
            <div className="app-card">
                <div className="app-card-header">
                    <h3>ImageCompare</h3>
                    <p>Visual regression</p>
                </div>
                <div className="app-card-body">
                    <ImageCompare
                        before="https://placehold.co/400x300/111/FFF?text=Draft"
                        after="https://placehold.co/400x300/111/FFF?text=Final"
                    />
                </div>
            </div>



            <div className="app-card">
                <div className="app-card-header">
                    <h3>PdfPreview (Live)</h3>
                    <p>Native browser rendering</p>
                </div>
                <div className="app-card-body">
                    <PdfPreview
                        file="manual_v2.pdf"
                        // Small valid PDF base64 (Hello World)
                        url="data:application/pdf;base64,JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXwKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSCisgICAgPj4KICA+PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9udAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCgo1IDAgb2JqCiAgPDwgL0xlbmd0aCA0NCA+PgpzdHJlYW0KQlQKNzAgNTAgVGQKL0YxIDEyIFRmCihIZWxsbywgQ2xhdWRlIENvZGUhKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTAgMDAwMDAgbiAKMDAwMDAwMDA2MCAwMDAwMCBuIAowMDAwMDAwMTU3IDAwMDAwIG4gCjAwMDAwMDAyNzYgMDAwMDAgbiAKMDAwMDAwMDM2MiAwMDAwMCBuIAp0cmFpbGVyCjw8CiAgL1NpemUgNgogIC9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo0NTYKJSVFT0YK"
                    />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>FileMetadataCard</h3>
                    <p>Asset details</p>
                </div>
                <div className="app-card-body">
                    <FileMetadataCard file={{
                        name: "background_layer.png",
                        path: "/assets/images/ui",
                        size: "2.4 MB",
                        created: "2026-01-15 10:30",
                        modified: "2026-01-16 14:20",
                        type: "image/png",
                        permissions: "rw-r--r--",
                        mime: "image/png"
                    }} />
                </div>
            </div>


            {/* -- Row 5: Data Tables & Lists -- */}
            <div className="app-card col-span-2">
                <div className="app-card-header">
                    <h3>CsvViewer</h3>
                    <p>Tabular data import</p>
                </div>
                <div className="app-card-body">
                    <CsvViewer data={`ID,Name,Role,Department,Status
1,John Doe,Developer,Engineering,Active
2,Jane Smith,Designer,Product,Away
3,Bob Johnson,Manager,Sales,Active
4,Alice Brown,CTO,Executive,Busy
5,Charlie Wilson,Intern,Engineering,Offline`} />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>FileAssetPicker (Improved)</h3>
                    <p>Resource selection</p>
                </div>
                <div className="app-card-body">
                    <FileAssetPicker
                        files={[
                            { id: '1', name: 'main.ts', type: 'code', size: '2kb' },
                            { id: '2', name: 'styles.css', type: 'code', size: '4kb' },
                            { id: '3', name: 'logo.png', type: 'image', size: '15kb', preview: 'https://placehold.co/100x100/333/FFF?text=IMG' },
                            { id: '4', name: 'docs', type: 'folder' },
                        ]}
                        selectedIds={['1']}
                        onSelect={() => { }}
                        viewMode="grid"
                    />
                </div>
            </div>

            <div className="app-card col-span-2">
                <div className="app-card-header">
                    <h3>CodeDiffViewer</h3>
                    <p>Source control insights</p>
                </div>
                <div className="app-card-body">
                    <CodeDiffViewer
                        oldCode={`function calculateTotal(items) {\n    return items.reduce((sum, item) => sum + item.price, 0);\n}`}
                        newCode={`function calculateTotal(items) {\n    // Add tax calculation\n    return items.reduce((sum, item) => {\n        return sum + item.price * 1.1;\n    }, 0);\n}`}
                        language="javascript"
                        filePath="src/utils/calc.js"
                        mode="unified"
                    />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>ImageDiff</h3>
                    <p>Visual regression testing</p>
                </div>
                <div className="app-card-body">
                    <ImageDiff
                        originalUrl="https://placehold.co/400x300/111/FFF?text=v1.0"
                        newUrl="https://placehold.co/400x300/222/FFF?text=v2.0"
                        originalLabel="v1.0"
                        newLabel="v2.0"
                    // className="h-full"
                    />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>AccordionList</h3>
                    <p>Collapsible sections</p>
                </div>
                <div className="app-card-body">
                    <AccordionList
                        items={[
                            { id: '1', title: 'Section 1', content: 'Content for section 1...' },
                            { id: '2', title: 'Section 2', content: 'Content for section 2...' },
                            { id: '3', title: 'Section 3', content: 'Content for section 3...' },
                        ]}
                    />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>RichMarkdownRenderer</h3>
                    <p>Safe markdown rendering</p>
                </div>
                <div className="app-card-body">
                    <RichMarkdownRenderer
                        content={`# Summary\n\n* Checked 5 files\n* Found 2 warnings\n\n\`\`\`javascript\nconst status = "OK";\n\`\`\``}
                    />
                </div>
            </div>
        </div>
    );
};
