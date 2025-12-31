import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase/firebase"

export default async function totalAmounts(uid: string) {
    if (!uid) return

    const userRef = doc(db, 'users', uid)
    const snapshot = await getDoc(userRef)
    if (!snapshot.exists()) return

    const totalSpent: number = snapshot.data().totalSpent
    const subsData: number = snapshot.data().totalSubscriptionSpent
    const oneTimeSpentTotal: number = snapshot.data().totalOneTimeSpent


    return { total: totalSpent, subsData: subsData, oneTimeTotal: oneTimeSpentTotal }
}
