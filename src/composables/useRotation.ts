import { ref } from "vue";

const NUM_ROTATIONS = 6;

export function useRotation() {
    const rotation = ref(0);

    function rotateForward() {
        rotation.value = (rotation.value + 1) % NUM_ROTATIONS;
    }

    function rotateBack() {
        rotation.value = (rotation.value + NUM_ROTATIONS - 1) % NUM_ROTATIONS;
    }

    function goTo(n: number) {
        rotation.value = ((n % NUM_ROTATIONS) + NUM_ROTATIONS) % NUM_ROTATIONS;
    }

    return { rotation, rotateForward, rotateBack, goTo };
}