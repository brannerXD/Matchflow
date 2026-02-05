async function createMatch(companyId, jobId, candidateId) {
    const reservations = await getData("reservations");

    const isReserved = reservations.find(r => r.candidateId === candidateId);

    if (isReserved) {
        alert("Este candidato ya está reservado por otra empresa");
        return;
    }

    // crear reserva
    await postData("reservations", {
        candidateId,
        jobId,
        companyId,
        active: true
    });

    // crear match
    await postData("matches", {
        companyId,
        jobId,
        candidateId,
        status: "pending"
    });

    alert("Match creado y candidato reservado");
}
async function updateMatchStatus(matchId, status) {
    await patchData("matches", matchId, { status });

    if (status === "discarded" || status === "hired") {
        const match = (await getData("matches")).find(m => m.id === matchId);

        const reservations = await getData("reservations");
        const res = reservations.find(r => r.candidateId === match.candidateId && r.active);

        if (res) {
            await patchData("reservations", res.id, { active: false });
        }
    }
}
