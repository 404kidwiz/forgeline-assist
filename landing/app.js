const dialog = document.querySelector('#detail-dialog');
const content = {
 source: ['Dimensional inspection · QLT-001 v3', '<p><strong>Sampling:</strong> Inspect 5 samples every 60 minutes.</p><p>PX-20 nominal dimension: 20.00 mm, tolerance ±0.10 mm.</p><p>The archived v2 specified a 120-minute interval. This preview displays the current fictional v3.</p><small>Fictional procedure for demonstration only. Not for operational use.</small>'],
 documentation: ['Approved documentation', '<p>The planned workspace routes questions to three source collections:</p><ul><li>Safety procedures — SAF-001 and SAF-002</li><li>Maintenance manuals — MNT-001 and MNT-002</li><li>Quality standards — QLT-001 and QLT-002</li></ul><p>This landing page is an interactive preview. The Dify agent and live integrations are not connected here.</p>'],
 shift: ['Your shift, in one place', '<p>The planned Shift Desk brings investigations, tasks, document changes and approval requests together.</p><p>This preview does not create tasks or write to GitHub. External actions in the full app will require an authorized person to review the exact action first.</p>'],
 notifications: ['You’re all caught up', '<p>No notifications in this preview.</p><p>The full workspace will show document changes, requests for approval and investigations needing your input here.</p>'],
 equipment: ['Demo equipment', '<p><strong>FL-01</strong> · Fictional manufacturing plant</p><ul><li>CV-12 — conveyor</li><li>PK-04 — packing station</li><li>PX-20 — inspected product</li></ul><p>The sample conversation concerns PX-20 dimensional inspection.</p>'],
 attachment: ['Approved sources first', '<p>Attachments are not enabled in this landing-page preview. The planned agent answers from approved, versioned documentation.</p>'],
 question: ['Explore the sample answer', '<p>This is a guided interface preview, not a connected AI assistant. Try the quality-inspection example shown in the workspace, or open its source to inspect the fictional procedure.</p>']
};
function openDetail(key) { const [title, body] = content[key]; document.querySelector('#dialog-title').textContent=title; document.querySelector('#dialog-content').innerHTML=body; dialog.showModal(); }
document.querySelectorAll('[data-dialog]').forEach(button=>button.addEventListener('click',()=>openDetail(button.dataset.dialog)));
document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());
document.querySelector('#dialog-done').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
document.querySelector('[data-view]').addEventListener('click',()=>document.querySelector('#question-input').focus());
document.querySelector('.composer').addEventListener('submit',event=>{event.preventDefault();openDetail('question');});
document.querySelector('#question-input').addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.isComposing){event.preventDefault();event.target.form.requestSubmit();}});
document.querySelectorAll('[data-feedback]').forEach(button=>button.addEventListener('click',()=>{document.querySelector('#feedback-status').textContent=button.dataset.feedback;}));
document.querySelector('#copy-answer').addEventListener('click',async()=>{try{await navigator.clipboard.writeText('Inspect 5 samples every 60 minutes. Source: fictional QLT-001 v3, Sampling.');document.querySelector('#feedback-status').textContent='Answer copied.';}catch{document.querySelector('#feedback-status').textContent='Select the answer text to copy it.';}});
